import { createMediaHandler } from 'next-tinacms-s3/dist/handlers'
import type { APIRoute } from 'astro'
import pkg from '@tinacms/auth'

const { isAuthorized } = pkg

// Convert to SSR
export const prerender = false

class NextApiResponseMock {
	body = ''
	statusCode = 200

	constructor() {}

	status(code: number) {
		this.statusCode = code
		return this
	}

	end(code: number) {
		this.status(code)
	}

	json(obj: unknown) {
		this.body = JSON.stringify(obj)
		return this
	}

	get init() {
		return { status: this.statusCode }
	}
}

export const ALL: APIRoute = async ({ request, locals, params }) => {
	// remove astro check warning
	locals = locals

	const mediaHandler = createMediaHandler(
		{
			config: {
				credentials: {
					accessKeyId: process.env.S3_ACCESS_KEY!,
					secretAccessKey: process.env.S3_SECRET_KEY!
				},
				region: process.env.S3_REGION! || 'us-east-1',
				endpoint: process.env.S3_API_ENDPOINT!
			},
			bucket: process.env.S3_BUCKET!,
			authorized: async (req) => {
				try {
					if (process.env.NODE_ENV === 'development') {
						return true
					}

					const user = await isAuthorized(req)
					return user?.verified ?? false
				} catch (e) {
					console.error(e)
					return false
				}
			}
		},
		{
			cdnUrl: process.env.S3_CDN_URL!
		}
	)

	const url = new URL(request.url)

	const req = {
		method: request.method,
		headers: Object.fromEntries(request.headers),
		url: `${url.pathname}${url.search}${url.hash}`,
		query: {
			// NextApiRequest adds a query convenience property
			...Object.fromEntries(url.searchParams),

			// delete requests assume [...media].ts path expanded into array.
			// adapt to the way your framework makes this available. Example:
			// /api/s3/media/folder/IMG_1234.jpg -> ['media', 'folder/IMG_1234.jpg']
			media: (params.media || '').split('/').map((c) => decodeURIComponent(c))
		}
	}

	const res = new NextApiResponseMock()
	await mediaHandler(req, res)
	return new Response(res.body, res.init)
}
