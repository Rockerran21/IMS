# Define the subscription ID
$subscriptionId = "2d0b03c0-875c-46fa-9993-32a30821afc5"

# Function to check and install Az module
function Ensure-AzModule {
    if (-not (Get-Module -ListAvailable -Name Az)) {
        Write-Host "Az module not found. Installing Az module..."
        Install-Module -Name Az -AllowClobber -Force
    } else {
        Write-Host "Az module is already installed."
    }
    Import-Module Az
}

# Ensure Az module is installed and imported
Ensure-AzModule

# Connect to Azure account
Write-Host "Logging in to Azure..."
Connect-AzAccount

# Select the specified subscription
Write-Host "Selecting subscription $subscriptionId..."
Select-AzSubscription -SubscriptionId $subscriptionId

# Function to delete all resource groups and wait for completion
function Delete-AllResourceGroups {
    Write-Host "Retrieving all resource groups in the subscription..."
    $resourceGroups = Get-AzResourceGroup
    $jobs = @()
    foreach ($rg in $resourceGroups) {
        Write-Host "Deleting resource group $($rg.ResourceGroupName)..."
        $jobs += Remove-AzResourceGroup -Name $rg.ResourceGroupName -Force -AsJob
    }
    # Wait for all jobs to complete
    foreach ($job in $jobs) {
        $job | Wait-Job
    }
}

# Function to delete all deployments and wait for completion
function Delete-AllDeployments {
    Write-Host "Retrieving all deployments in the subscription..."
    $deployments = Get-AzDeployment
    foreach ($deployment in $deployments) {
        Write-Host "Deleting deployment $($deployment.DeploymentName)..."
        Remove-AzDeployment -Name $deployment.DeploymentName -Force
    }
}

# Function to delete all role assignments and wait for completion
function Delete-AllRoleAssignments {
    Write-Host "Retrieving all role assignments in the subscription..."
    $roleAssignments = Get-AzRoleAssignment
    foreach ($roleAssignment in $roleAssignments) {
        Write-Host "Deleting role assignment $($roleAssignment.Name)..."
        Remove-AzRoleAssignment -ObjectId $roleAssignment.ObjectId -RoleDefinitionName $roleAssignment.RoleDefinitionName -Scope $roleAssignment.Scope
    }
}

# Function to delete all policies and wait for completion
function Delete-AllPolicies {
    Write-Host "Retrieving all policies in the subscription..."
    $policies = Get-AzPolicyAssignment
    foreach ($policy in $policies) {
        Write-Host "Deleting policy $($policy.Name)..."
        Remove-AzPolicyAssignment -Name $policy.Name -Scope $policy.Scope
    }
}

# Function to delete orphaned resources and wait for completion
function Delete-AllOrphanedResources {
    Write-Host "Retrieving all resources in the subscription..."
    $resources = Get-AzResource
    foreach ($resource in $resources) {
        Write-Host "Deleting resource $($resource.Name) in group $($resource.ResourceGroupName)..."
        $apiVersion = (Get-AzResourceProvider -ProviderNamespace $resource.ResourceType.Split('/')[0]).ResourceTypes | Where-Object ResourceTypeName -eq $resource.ResourceType.Split('/')[1] | Select-Object -ExpandProperty ApiVersions | Sort-Object -Descending | Select-Object -First 1
        Remove-AzResource -ResourceId $resource.ResourceId -Force -ApiVersion $apiVersion
    }
}

# Execute all delete functions and wait for completion
Delete-AllResourceGroups
Delete-AllDeployments
Delete-AllRoleAssignments
Delete-AllPolicies
Delete-AllOrphanedResources

# Final check to ensure everything is deleted
Write-Host "Final check to ensure all resources are deleted..."
$remainingResources = Get-AzResource
if ($remainingResources) {
    Write-Host "Some resources could not be deleted:"
    $remainingResources | Format-Table -Property Name, ResourceGroupName, ResourceType, Location
} else {
    Write-Host "All resources have been successfully deleted."
}

Write-Host "All resources, deployments, role assignments, and policies have been deleted. Monitor the Azure portal for any remaining resources."
