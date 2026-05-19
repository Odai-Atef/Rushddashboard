# API Contract: Authentication

## Endpoint: POST /auth/register

### Request Headers
| Header | Value | Description |
|--------|-------|-------------|
| Content-Type | application/json | Standard JSON payload |

### Request Body (RegisterDto)
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "companyId": "550e8400-e29b-41d4-a716-446655440000",
  "roleId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### Request Fields
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Minimum 6 characters |
| firstName | string | Yes | Non-empty, max 100 chars |
| lastName | string | Yes | Non-empty, max 100 chars |
| companyId | UUID | Yes | Valid UUID v4 |
| roleId | UUID | Yes | Valid UUID v4 |

### Supported Fields (Backend Contract)
The backend RegisterDto **only** accepts the 6 fields listed above. Any additional properties in the request body will result in validation errors.

### Unsupported Fields (Must NOT be sent)
| Field | Backend Error |
|-------|---------------|
| fullName | "property fullName should not exist" |
| phone | "property phone should not exist" |
| company | "property company should not exist" |
| role | "property role should not exist" |
| confirmPassword | "property confirmPassword should not exist" |

### Response: Success (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "roleId": "550e8400-e29b-41d4-a716-446655440001"
  }
}
```

### Response: Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "firstName",
      "message": "firstName should not be empty"
    },
    {
      "field": "companyId",
      "message": "companyId must be a UUID"
    }
  ]
}
```

### Response: Conflict (409 Conflict)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

## Supporting Endpoints (for dropdown population)

### GET /companies
Returns list of available companies for registration.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Acme Corp"
    }
  ]
}
```

### GET /roles
Returns list of available roles for registration.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Manager"
    }
  ]
}
```

## Error Handling Strategy

### Client-Side Validation (Before Submission)
- Invalid email format → Inline error below email field
- Password < 6 chars → Inline error below password field
- Mismatched passwords → Inline error below confirmPassword field
- Empty required fields → Inline errors below respective fields

### Backend Validation (After Submission)
- Field-specific errors → Map to corresponding form fields
- General errors → Display in summary banner
- Network errors → Display generic error with retry option
