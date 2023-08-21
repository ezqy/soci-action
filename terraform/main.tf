resource "aws_iam_openid_connect_provider" "github_actions" {
  count           = var.create_oidc ? 1 : 0
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = data.tls_certificate.github_actions.certificates[*].sha1_fingerprint
}

resource "aws_iam_role" "github_actions" {
  name               = "github-actions-cicd-${random_string.random_id.id}"
  assume_role_policy = data.aws_iam_policy_document.github_actions.json
  description        = "IAM Role for GitHub Actions OIDC"
}

resource "aws_iam_policy" "github_actions_custom_policy" {
  name        = "github-actions-sosi-${random_string.random_id.id}"
  description = "Custom policy for GitHub Actions IAM Role"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchCheckLayerAvailability",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:ListImages",
          "ecr:DescribeImages",
          "ecr:GetAuthorizationToken",
          "tag:GetResources"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_actions_custom_policy_attachment" {
  policy_arn = aws_iam_policy.github_actions_custom_policy.arn
  role       = aws_iam_role.github_actions.name
}
