variable "github_org_name" {
  description = "GitHub organization name"
  type        = string
}

variable "allowed_github_repositories" {
  description = "List of allowed GitHub repositories"
  type        = list(string)
}

variable "create_oidc" {
  description = "Control the creation of oidc provider. Set to 'false' if resources should not be created."
  type        = bool
  default     = true
}

variable "region" {
  type    = string
  default = "ap-northeast-1"
}
