import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Building2, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useSignIn } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})
type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const signIn = useSignIn()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(values: FormValues) {
    setError('')
    try {
      await signIn(values.email, values.password)
    } catch {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary text-white mb-4 shadow-md">
            <Building2 className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-text">Acervo Documental</h1>
          <p className="text-sm text-text-muted mt-1">Municipalidad de Challhuahuacho</p>
        </div>

        {/* Form */}
        <div className="card shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="usuario@challhuahuacho.gob.pe"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-8 text-text-muted hover:text-text transition-colors"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 rounded px-3 py-2">{error}</p>
            )}

            <Button type="submit" loading={isSubmitting} className="w-full">
              Iniciar sesión
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Sistema de Gestión Documental v1.0 — © {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  )
}
