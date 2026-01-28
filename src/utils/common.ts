/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timer: number | null = null

    return function (this: any, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer)

        const content = this
        timer = window.setTimeout(() => {
            fn.apply(content, args)
        }, delay)
    }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    call: () => void = () => { }
): (...args: Parameters<T>) => void {
    let lastTime = 0

    return function (this: any, ...args: Parameters<T>) {
        const now = new Date().getTime()

        if (now - lastTime > delay) {
            lastTime = now
            fn.apply(this, args)
        } else {
            call()
        }
    }
}

/**
 * 剪贴板复制功能
 */
export function clipboard(text: string, callback?: () => void): void {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            callback?.()
        })
        .catch(() => {
            alert('Oops, unable to copy')
        })
}

export async function clipboardImage(src: string, callback: () => void): Promise<void> {
    const { state } = await navigator.permissions.query({
        name: 'clipboard-write' as PermissionName
    })

    if (state !== 'granted') return

    try {
        const data = await fetch(src)
        const blob = await data.blob()

        // navigator.clipboard.write 仅支持 png 图片
        if (blob.type === 'image/png') {
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ])

            return callback()
        }

        const objectURL = URL.createObjectURL(blob)

        const img = new Image()
        img.src = objectURL
        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) return

            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            canvas.toBlob(
                (blob) => {
                    if (!blob) return
                    const data = [new ClipboardItem({ [blob.type]: blob })]

                    navigator.clipboard
                        .write(data)
                        .then(() => {
                            callback()
                        })
                        .catch((err) => {
                            console.error(err)
                        })

                    URL.revokeObjectURL(objectURL)
                },
                'image/png',
                1
            )
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.name, err.message)
        }
    }
}

export function hashStrToHexColor(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff
        color += value.toString(16).padStart(2, '0')
    }
    return color
}

interface EmitCallResult<T> {
    event: string
    data: T
    callBack: () => void
}

export function emitCall<T>(event: string, data: T, fn?: () => void): EmitCallResult<T> {
    return { event, data, callBack: fn || (() => { }) }
}

declare global {
    interface Window {
        electron?: any
    }
}

// 判断是否是客户端模式
export function isElectronMode(): boolean {
    return electron() !== undefined
}

export function electron(): any | undefined {
    return window.electron
}

export function htmlDecode(input: string): string {
    return input
        .replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#34;/g, '"')
}

interface VideoImageResult {
    url: string
    width: number
    height: number
    duration: number
    file: File | null
}

// 文件转 图片 关键函数  异步
export function getVideoImage(file: File, time = 1): Promise<VideoImageResult> {
    return new Promise((resolve) => {
        const video = document.createElement('video')

        const objectURL = URL.createObjectURL(file)

        video.src = objectURL
        video.currentTime = time
        video.autoplay = true
        video.muted = true

        video.oncanplay = () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            const data: VideoImageResult = {
                url: canvas.toDataURL('image/jpeg', 1),
                width: video.videoWidth,
                height: video.videoHeight,
                duration: video.duration,
                file: null
            }

            canvas.toBlob((blob) => {
                if (!blob) return
                data.file = new File([blob], 'image.jpeg', {
                    type: blob.type,
                    lastModified: Date.now()
                })

                URL.revokeObjectURL(objectURL)

                resolve(data)
            }, 'image/jpeg')
        }
    })
} 