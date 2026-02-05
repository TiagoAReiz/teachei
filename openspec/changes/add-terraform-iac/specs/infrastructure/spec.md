## ADDED Requirements

### Requirement: Infrastructure as Code with Terraform

The system SHALL maintain all Azure infrastructure resources as Terraform code in the `infrastructure/` directory.

#### Scenario: Full infrastructure provisioning

- **WHEN** running `terraform apply` with production variables
- **THEN** all required Azure resources are created or updated:
  - Resource Group
  - Azure Container Registry
  - PostgreSQL Flexible Server
  - Cosmos DB Account with database
  - Storage Account with blob containers
  - Container Apps Environment
  - Container App for API
  - Log Analytics Workspace

#### Scenario: Resource naming consistency

- **WHEN** provisioning resources for an environment
- **THEN** resource names follow the convention:
  - Resource Group: `rg-teachei-{env}`
  - Container Registry: `acrteachei`
  - PostgreSQL: `psql-teachei-{env}`
  - Cosmos DB: `cosmos-teachei-{env}`
  - Storage Account: `stteachei{env}`
  - Container Apps Env: `env-teachei-{env}`
  - Log Analytics: `log-teachei-{env}`

### Requirement: Remote State Management

The system SHALL store Terraform state in Azure Blob Storage.

#### Scenario: State file locking

- **WHEN** multiple operators run terraform simultaneously
- **THEN** Azure Storage locking prevents state corruption

#### Scenario: State encryption

- **WHEN** storing state in Azure Blob Storage
- **THEN** state is encrypted at rest with Azure-managed keys

### Requirement: Modular Infrastructure

The system SHALL organize Terraform code into reusable modules.

#### Scenario: Module structure

- **WHEN** examining the infrastructure directory
- **THEN** each Azure service type has its own module:
  - `modules/acr/` - Container Registry
  - `modules/postgresql/` - PostgreSQL Flexible Server
  - `modules/cosmosdb/` - Cosmos DB
  - `modules/storage/` - Storage Account
  - `modules/container-apps/` - Container Apps
  - `modules/monitoring/` - Log Analytics

#### Scenario: Module reusability

- **WHEN** creating a new environment (e.g., staging)
- **THEN** only a new tfvars file is needed, modules are reused

### Requirement: Sensitive Variable Management

The system SHALL handle sensitive variables securely.

#### Scenario: Secrets in CI/CD

- **WHEN** running Terraform in GitHub Actions
- **THEN** secrets are passed via environment variables (TF_VAR_*)

#### Scenario: No secrets in code

- **WHEN** examining Terraform files in the repository
- **THEN** no passwords, keys, or tokens are committed

### Requirement: CI/CD Integration

The system SHALL provide GitHub Actions workflow for Terraform operations.

#### Scenario: Plan on pull request

- **WHEN** a pull request modifies files in `infrastructure/`
- **THEN** terraform plan runs and shows proposed changes

#### Scenario: Apply on main merge

- **WHEN** changes to `infrastructure/` are merged to main
- **THEN** terraform apply runs with production approval gate

### Requirement: Blob Storage Configuration

The system SHALL provision Storage Account with containers for photo storage.

#### Scenario: Profile photos container

- **WHEN** Storage Account is provisioned
- **THEN** a `profile-photos` container exists with public blob access

#### Scenario: Vehicle photos container

- **WHEN** Storage Account is provisioned
- **THEN** a `vehicle-photos` container exists with public blob access

#### Scenario: CORS configuration

- **WHEN** Storage Account is provisioned
- **THEN** CORS is configured to allow frontend origins
