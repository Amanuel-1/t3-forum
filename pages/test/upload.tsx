import { uploadFiles } from '@/lib/utils'
import { NextPage } from 'next'
import React, { useState } from 'react'
import { UploadFileResponse } from 'uploadthing/client'

type Props = {}

const Upload: NextPage = (props: Props) => {
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState('')

  const [response, setResponse] = useState<UploadFileResponse[]>()
  const [error, setError] = useState<any>()

  const fileChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setFilePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const fileUploadHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const data = new FormData()

    if (file) {
      data.append('file_gwejh', file)

      const res = await uploadFiles({
        files: [file],
        endpoint: 'imageUploader',
      })

      setResponse(res)
      console.log(res) // Success
    }

    console.log(file)
    console.log(error)
  }

  return (
    <form className='p-4 space-x-4' onSubmit={fileUploadHandler}>
      <input className='border' type='file' multiple={false} onChange={fileChangeHandler} />
      <div className='overflow-hidden w-[200px] border p-2'>
        <img className='w-[200px] aspect-square object-cover' src={filePreview} alt='Image Preview' />
      </div>
      <button>Upload</button>
    </form>
  )
}

export default Upload
