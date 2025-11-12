# ========================================
# Lambda Function
# ========================================

# Create Lambda function
resource "aws_lambda_function" "main" {
  filename         = var.zip_file_path
  function_name    = "${var.project_name}-${var.environment}"
  role            = var.lambda_role_arn
  handler         = var.handler
  source_code_hash = filebase64sha256(var.zip_file_path)
  runtime         = var.runtime
  timeout         = var.timeout
  memory_size     = var.memory_size

  # Reserved Concurrent Executions (optional)
  reserved_concurrent_executions = var.reserved_concurrent_executions >= 0 ? var.reserved_concurrent_executions : null

  environment {
    variables = var.environment_variables
  }

  # VPC Configuration (optional)
  dynamic "vpc_config" {
    for_each = var.vpc_config != null ? [var.vpc_config] : []
    content {
      subnet_ids         = vpc_config.value.subnet_ids
      security_group_ids = vpc_config.value.security_group_ids
    }
  }

  # Dead Letter Queue Configuration (optional)
  dynamic "dead_letter_config" {
    for_each = var.dead_letter_config_target_arn != "" ? [1] : []
    content {
      target_arn = var.dead_letter_config_target_arn
    }
  }

  tags = merge(
    var.tags,
    {
      Name        = "${var.project_name}-${var.environment}"
      Environment = var.environment
    }
  )

  depends_on = [
    aws_cloudwatch_log_group.lambda_log_group
  ]
}

# ========================================
# CloudWatch Log Group
# ========================================

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${var.project_name}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = merge(
    var.tags,
    {
      Name        = "${var.project_name}-${var.environment}-logs"
      Environment = var.environment
    }
  )
}

# ========================================
# Lambda Function URL (Optional - for direct HTTP access)
# ========================================

resource "aws_lambda_function_url" "main" {
  count              = var.enable_function_url ? 1 : 0
  function_name      = aws_lambda_function.main.function_name
  authorization_type = var.function_url_auth_type

  cors {
    allow_credentials = var.function_url_cors.allow_credentials
    allow_origins     = var.function_url_cors.allow_origins
    allow_methods     = var.function_url_cors.allow_methods
    allow_headers     = var.function_url_cors.allow_headers
    expose_headers    = var.function_url_cors.expose_headers
    max_age           = var.function_url_cors.max_age
  }
}

# ========================================
# Lambda Alias (for versioning)
# ========================================

resource "aws_lambda_alias" "main" {
  count            = var.create_alias ? 1 : 0
  name             = var.alias_name
  description      = "Alias for ${var.project_name}-${var.environment}"
  function_name    = aws_lambda_function.main.function_name
  function_version = var.alias_function_version

  lifecycle {
    ignore_changes = [function_version]
  }
}

# ========================================
# Lambda Permission for API Gateway
# ========================================

resource "aws_lambda_permission" "api_gateway" {
  count         = var.allow_api_gateway_invoke ? 1 : 0
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.main.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = var.api_gateway_execution_arn
}

# ========================================
# Lambda Provisioned Concurrency (Optional)
# ========================================

resource "aws_lambda_provisioned_concurrency_config" "main" {
  count                             = var.provisioned_concurrent_executions > 0 ? 1 : 0
  function_name                     = aws_lambda_function.main.function_name
  provisioned_concurrent_executions = var.provisioned_concurrent_executions
  qualifier                         = var.create_alias ? aws_lambda_alias.main[0].name : aws_lambda_function.main.version

  depends_on = [aws_lambda_function.main]
}
