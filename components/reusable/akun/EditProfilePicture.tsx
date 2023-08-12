import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardTitle, Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { uploadFiles } from '@/lib/utils'
import { trpc } from '@/utils/trpc'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { UploadFileResponse } from 'uploadthing/client'

type TProps = {
  user: {
    id: string,
    username: string,
    name: string,
    bio: string | null,
    image: string | null
  },
  openEditPictMenu: boolean,
  setProfileHasBeenEdited: (value: React.SetStateAction<boolean>) => void,
  setOpenEditPictMenu: (value: React.SetStateAction<boolean>) => void
}

const EditProfilePicture: React.FC<TProps> = ({ user, openEditPictMenu, setOpenEditPictMenu, setProfileHasBeenEdited }) => {
  const { isLoading, mutate: editUser, error: userError } = trpc.user.editAccount.useMutation()

  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  const [beginUpload, setBeginUpload] = useState(false)

  const [response, setResponse] = useState<UploadFileResponse | null>()
  const [error, setError] = useState<string>()

  const fileChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0]

      if (file.size > 1024 * 3000) return alert('File nya ke gedean bre') // 1024 = 1 kb * 2000 = 3000 kb = 3 mb

      setFile(e.target.files[0])
      setFilePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const fileUploadHandler = async () => {
    const data = new FormData()

    if (file) {
      data.append('file_gwejh', file)

      setBeginUpload(true)

      const res = await uploadFiles({
        files: [file],
        endpoint: 'imageUploader',
      })

      setResponse(res[0])

      editUser({
        name: user.name,
        username: user.username,
        bio: user.bio,
        image: res[0].url
      }, {
        onError: () => {
          setError('Udh ke upload Tapi Error :(')
        }
      })

      setBeginUpload(false)
      setFile(null)
      setFilePreview(null)

      if (!res[0].url) setError('Duh Error Bre')
    }

  }

  return (
    <div className={`fixed items-center justify-center inset-0 bg-secondary/60 z-30 transition-all ${openEditPictMenu ? 'flex' : 'hidden'}`}>
      <div className={`container flex justify-center transition-all ${openEditPictMenu ? 'translate-y-0' : '-translate-y-[200%]'}`}>

        <Alert className={`fixed w-max top-4 transition-all ${response ? 'translate-y-0' : '-translate-y-[200%]'}`}>
          <AlertTitle className='tracking-wide'>Notifikasi</AlertTitle>
          <AlertDescription>{error || 'Hore Foto Profil lu ke ganti'}</AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Edit Foto Profil Lo</CardTitle>
            <ul className='space-y-2 py-4'>
              <li>Max <code className='bg-secondary p-1 rounded border'>2MB</code> Ya gess,</li>
              <li>Ukuran nya <code className='bg-secondary p-1 rounded border'>500x500</code> (Recomended)</li>
            </ul>

            <label htmlFor='pp' className='text-white cursor-pointer font-bold text-sm hover:bg-green-600 text-center rounded p-2 w-max bg-green-500'>Upload Foto</label>
            <input accept='.png,.jpg,.jpeg' id='pp' type='file' multiple={false} className='hidden' onChange={fileChangeHandler} />
          </CardHeader>
          <CardContent>
            <div
              className='bg-muted flex items-center justify-center aspect-square w-full border bg-center bg-cover'
              style={{
                backgroundImage: `url(${filePreview})`,
              }}
            />
          </CardContent>
          <CardFooter className='flex flex-col gap-2'>
            <Button onClick={fileUploadHandler} disabled={beginUpload} className='w-full'>
              {beginUpload ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tunggu Bre
                </>
              ) : "Ganti PP"}
            </Button>
            <Button className='w-full' variant='outline' disabled={beginUpload} onClick={() => {
              setOpenEditPictMenu(false)
              setResponse(null)
              setProfileHasBeenEdited(true)
            }}>
              {response ? 'Tutup Menu' : 'Gak Jadi'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default EditProfilePicture
