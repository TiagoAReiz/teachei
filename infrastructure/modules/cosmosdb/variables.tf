variable "account_name" {
  description = "Name of the Cosmos DB account"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "database_name" {
  description = "Name of the SQL database"
  type        = string
}

variable "consistency_level" {
  description = "Consistency level for the account"
  type        = string
  default     = "Session"
}

variable "max_interval_in_seconds" {
  description = "Max interval in seconds for bounded staleness"
  type        = number
  default     = 5
}

variable "max_staleness_prefix" {
  description = "Max staleness prefix for bounded staleness"
  type        = number
  default     = 100
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
