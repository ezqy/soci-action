data "tls_certificate" "github_actions" {
  url = "https://token.actions.githubusercontent.com/.well-known/openid-configuration"
}

data "aws_iam_policy_document" "github_actions" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.self.id}:oidc-provider/token.actions.githubusercontent.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [for repo in var.allowed_github_repositories : "repo:${var.github_org_name}/${repo}:*"]
    }
  }
}

data "aws_caller_identity" "self" {}
data "aws_region" "current" {}

resource "random_string" "random_id" {
  length  = 5
  special = false
  upper   = false
}
