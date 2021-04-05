const messages = {
  UserNotConfirmedException:
    'You email has not been confirmed yet, check your email',
  UsernameExistsException: 'E-mail already exists',
  InvalidPasswordException: 'Inválid password. Try a stronger one.',
  DefaultException: 'An unexpected error occurred'
}

export function getCognitoErrorMessage(error: {
  code: string
  message: string
}) {
  return messages[error.code] || error.message || messages.DefaultException
}
