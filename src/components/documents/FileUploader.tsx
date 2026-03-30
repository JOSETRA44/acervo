import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'

interface FileUploaderProps {
  file: File | null
  onFile: (file: File | null) => void
  accept?: Record<string, string[]>
  maxSize?: number
}

export function FileUploader({ file, onFile, accept = { 'application/pdf': ['.pdf'] }, maxSize = 50 * 1024 * 1024 }: FileUploaderProps) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) onFile(accepted[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
  })

  if (file) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-2">
        <File className="h-5 w-5 text-info shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{file.name}</p>
          <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
        </div>
        <button onClick={() => onFile(null)} className="text-text-muted hover:text-danger transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-8 rounded-lg border-2 border-dashed',
          'cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-surface-2'
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn('h-6 w-6', isDragActive ? 'text-primary' : 'text-text-muted')} />
        <div className="text-center">
          <p className="text-sm font-medium text-text">
            {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra o haz clic para subir'}
          </p>
          <p className="text-xs text-text-muted mt-1">PDF hasta {formatFileSize(maxSize)}</p>
        </div>
      </div>
      {fileRejections.length > 0 && (
        <p className="text-xs text-danger mt-1">
          {fileRejections[0].errors[0].message}
        </p>
      )}
    </div>
  )
}
