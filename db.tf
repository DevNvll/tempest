data "aws_secretsmanager_secret_version" "credentials" {
  secret_id = "database_secrets"
}

locals {
  db_creds = jsondecode(
    data.aws_secretsmanager_secret_version.credentials.secret_string
  )
}

resource "aws_default_vpc" "default" {
  tags = {
    Name = "Default VPC"
  }
}

resource "aws_security_group" "tempest_db" {
  name = "tempest_db_prd"

  description = "RDS postgres servers (terraform-managed)"
  vpc_id = aws_default_vpc.default.id

  # Only postgres in
  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic.
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "tempest_db_prd" {
  allocated_storage        = 10 
  engine                   = "postgres"
  engine_version           = "13.1"
  identifier               = "tempestdb"
  instance_class           = "db.t3.micro"
  multi_az                 = false
  name                     = "tempestdb"
  username                 = local.db_creds.username
  password                 = local.db_creds.password
  port                     = 5432
  publicly_accessible      = true
  storage_encrypted        = true
  skip_final_snapshot      = true
  vpc_security_group_ids   = [aws_security_group.tempest_db.id]
}