"use client";

import { useCallback, useState, MouseEvent } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from '@/components/Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { useToast } from "@/hooks/use-toast"
import { uploadFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { CircleX } from 'lucide-react';


interface Props {
    ownerId: string;
    accountId: string;
    className?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
    const path = usePathname();
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);

        const uploadPromisses = acceptedFiles.map(async (file) => {
            if(file.size > MAX_FILE_SIZE) {
                setFiles((prevFiles) => {
                    return prevFiles.filter((f) => f.name !== file.name);
                });

                return toast({
                    description: (
                        <p className='body-2 text-white'>
                            <span className='font-semibold'>{file.name}</span>
                            is too large. Max file size is 50MB
                        </p>
                    ), className: 'error-toast'
                });
            }
            return uploadFile({ file, ownerId, accountId, path }).then((uploadedFile) => {
                if(uploadedFile) {
                    setFiles((prevFiles) => {
                        return prevFiles.filter((f) => f.name !== file.name);
                    });
                }
            });
        });
        await Promise.all(uploadPromisses);
    }, [ownerId, accountId, path, toast]);
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const handleRemoveFile = (e: MouseEvent<HTMLButtonElement>, fileName: string) => {
        e.stopPropagation();
        setFiles((prevFiles) => {
            return prevFiles.filter((file) => file.name !== fileName);
        });
    }

    return (
        <div {...getRootProps()} className='cursor-pointer'>
            <input {...getInputProps()} />
            <Button type='button' className={cn("uploader-button", className)}>
                <Image
                    src="/assets/icons/upload.svg"
                    alt='upload'
                    width={24}
                    height={24}
                />
                <p className='text-white'>Upload</p>
            </Button>
            {files.length > 0 && (
                <ul className='uploader-preview-list'>
                    <h4 className='h4 text-light-100 dark:text-light-400'>Uploading</h4>
                    {files.map((file: File, index: number) => {
                        const { type, extension } = getFileType(file.name);

                        return (
                            <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                                <div className='flex items-center gap-3'>
                                    <Thumbnail
                                        type={type}
                                        extension={extension}
                                        url={convertFileToUrl(file)}
                                    />
                                    <div className='preview-item-name'>
                                        {file.name}
                                        <Image
                                            src="/assets/icons/file-loader.gif"
                                            alt='loader'
                                            width={80}
                                            height={26}
                                        />
                                    </div>
                                </div>
                                <Button onClick={(e) => handleRemoveFile(e, file.name)} className="share-remove-user">
                                    <CircleX
                                        width={24}
                                        height={24}
                                        className="text-[rgba(51,63,78,0.5)] dark:text-light-200"
                                    />
                                </Button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default FileUploader