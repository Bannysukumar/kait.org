import ChangePasswordForm from './ChangePasswordForm'

export default function PasswordResetPage({
  params,
}: {
  params: { token: string }
}) {
  return <ChangePasswordForm token={params.token} />
}
