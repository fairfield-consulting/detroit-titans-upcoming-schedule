import { ZodError } from 'zod'

export function zodErrorToJSON({ errors }: ZodError) {
  const json: Record<string, string> = {}
  for (const error of errors) {
    json[error.path.join('.')] = error.message
  }
  return json
}
