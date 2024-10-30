import { ClipboardCheck, ClipboardCopy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface Props {
  value: string
}

export function ClipBoardInput({ value }: Props) {
  const [isCopied, setIsCopied] = useState(false)

  function handleClipboard() {
    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true)

      toast.success('Copiado para a área de transferência')
    })
  }

  function handleInputClick() {
    window.open(value, '_blank')
  }

  useEffect(() => {
    return () => {
      setIsCopied(false)
    }
  }, [])

  return (
    <div className="rounded-sm">
      <div className="flex items-center justify-center gap-2">
        <Input
          onClick={handleInputClick}
          value={value}
          className="cursor-pointer placeholder-gray-200"
        />
        <Button onClick={handleClipboard} variant="outline" size="icon">
          {isCopied ? (
            <ClipboardCheck className="size-4 text-emerald-600" />
          ) : (
            <ClipboardCopy className="size-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  )
}
