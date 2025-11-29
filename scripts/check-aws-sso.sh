#!/bin/bash

# Check if AWS SSO is logged in before starting the dev environment

AWS_PROFILE=${AWS_PROFILE:-default}

echo "🔐 Checking AWS SSO status for profile: $AWS_PROFILE"

# Check if SSO session is valid
if ! aws sts get-caller-identity --profile "$AWS_PROFILE" &>/dev/null; then
    echo "⚠️  AWS SSO session expired or not logged in"
    echo "🔑 Please log in to AWS SSO:"
    echo ""
    echo "    aws sso login --profile $AWS_PROFILE"
    echo ""
    echo "Would you like to log in now? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        aws sso login --profile "$AWS_PROFILE"
    else
        echo "⚠️  Continuing without AWS SSO login. AWS features may not work."
        exit 0
    fi
fi

echo "✅ AWS SSO session is valid"
aws sts get-caller-identity --profile "$AWS_PROFILE" | grep "UserId\|Account\|Arn"
