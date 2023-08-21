output "iam_role_arn" {
  description = "The ARN of the IAM Role created for GitHub Actions"
  value       = aws_iam_role.github_actions.arn
}
