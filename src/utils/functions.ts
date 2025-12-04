import { getAccessToken } from '@/utils/auth'

interface ImageInfo {
    width: number
    height: number
}

/**
 * 通过图片url获取图片大小
 *
 * @param {String} imgsrc 例如图片名： D8x5f13a53dbc4b9_350x345.png
 */
export function getImageInfo(imgsrc: string): ImageInfo {
    const data: ImageInfo = {
        width: 0,
        height: 0
    }

    const arr = imgsrc.split('_')
    if (arr.length == 1) return data

    const info = arr[arr.length - 1].match(/\d+x\d+/g)
    if (info == null) return data

    const dimensions = info[0].split('x')

    return {
        width: parseInt(dimensions[0]),
        height: parseInt(dimensions[1])
    }
}

/**
 * 文件下载方法
 */
export function download(msg_id: number): void {
    const token = getAccessToken()
    try {
        const link = document.createElement('a')
        link.href = `${import.meta.env.VITE_BASE_API
            }/api/v1/talk/records/file/download?msg_id=${msg_id}&token=${token}`
        link.click()
    } catch (e) {
        console.warn(e)
    }
}

export function fileView(path: string): void {
    try {
        const link = document.createElement('a')
        link.target = '_blank'
        link.href = `https://view.yuesutech.com/?fileUrl=${path}`
        link.click()
    } catch (e) {
        console.warn(e)
    }
}

export function insertText(obj: HTMLTextAreaElement | HTMLInputElement, str: string): void {
    if (document.selection) {
        const sel = document.selection.createRange()
        sel.text = str
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
        const startPos = obj.selectionStart
        const endPos = obj.selectionEnd
        const cursorPos = startPos
        const tmpStr = obj.value
        obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length)
        obj.selectionStart = obj.selectionEnd = cursorPos + str.length

        obj.focus()
    } else {
        obj.value += str
    }
}

/**
 * 将秒数转换为时:分:秒格式
 */
export function countDownTime(second: number = 0): string {
    // 小于10 加0 处理
    function formate0to9(arg: number): string {
        return arg < 10 ? `0${arg}` : arg.toString()
    }

    const hours = formate0to9(Math.floor((second / 60 / 60) % 24))
    const minutes = formate0to9(Math.floor((second / 60) % 60))
    const seconds = formate0to9(Math.floor(second % 60))

    return `${hours}:${minutes}:${seconds}`
}

export function removeTags(str: string): string {
    return str.replace(/<\/?[^>]+>/gi, '')
}

export function downloadImage(src: string, name?: string): void {
    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function () {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        if (!context) return

        context.drawImage(image, 0, 0, image.width, image.height)
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        const event = new MouseEvent('click')
        a.download = name || 'image.png'
        a.href = url
        a.dispatchEvent(event)
    }
    image.src = src
}

/**
 * 获取文件名后缀
 */
export const getFileNameSuffix = (name: string): string => {
    const arr = name.split('.')
    return arr[arr.length - 1]
} 