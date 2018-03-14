import Head from 'next/head'
import Link from "next/link";
import 'isomorphic-unfetch'

const log = (...args) => console.log('%csw', 'background-color:black; color:white; padding: 2px 0.5em; border-radius: 0.5em;', ...args)

const styles = () => (
	<style global jsx>{`
		nav {
			text-align: left;
			background-color: black;
			color: white;
			padding: 12px;
			position: fixed;
			z-index: 1000;
			top: 0;
			left: 0;
			right: 0;
		};
		header {
			display: flex;
			padding: 0;
			margin: 0 0 30px 0;
		};
		header nav a {
			padding: 6px 8px;
			color: white;
			text-decoration: none;
			font-size: 16px;
		}
		a {
			color: #0e0e0e;
			text-decoration: none;
		}
		ul {
			padding: 0;
		}
		li {
			list-style-type: none;
			position: relative;
			padding: 20px 30px 20px 80px;
			border-bottom: 1px solid #eee;
			line-height: 20px;
		}
		.points {
			font-size: 18px;
			font-weight: 700;
			position: absolute;
			top: 50%;
			left: 0;
			width: 80px;
			text-align: center;
			margin-top: -10px;
		}
		.user {
			padding: 10px;
		}
		.user div {
			margin: 10px 0 5px 0;
			padding-left: 15px;
		}
		@media (max-width: 600px) {
			header {
				justify-content: none;
			}
		}
		body {
			font-family: Helvetica,sans-serif;
		}
	`}</style>
)

const feed = ({id, points, url, title, user, comments_count}) => (
	<li key={id}>
		<span className="points">{points}</span>
		<span>
			<div><a href={url} target="_black">{title}</a></div>
			<div>
				<span>by <Link href={`/?user=${user}`}><a>{user}</a></Link></span>
				<span> | <Link href={`/comments?id=${id}`}><a>{comments_count || 0}</a></Link></span>
			</div>
		</span>
	</li>
)

const feeds = src => (
	<ul>{src.map(f => feed(f))}</ul>
)

const user = user => (
	<div className="user">
		<h1>{user.id}</h1>
		<div>Created: {user.created}</div>
		<div>Karma: {user.karma}</div>
		<div>Delay: {user.delay}</div>
		<div>About: {user.about}</div>
	</div>
)

const nav = () => (
	<header>
		<nav>
			<Link href='/'><a>News</a></Link>
			<Link href='/?newest'><a>Newest</a></Link>
			<Link href='/?ask'><a>Ask</a></Link>
			<Link href='/?show'><a>Show</a></Link>
			<Link href='/?jobs'><a>Jobs</a></Link>
		</nav>
	</header>
)

export default class HNPWA extends React.PureComponent {
	static routes (query) {
		query = Object.entries(query)[0]
		const subpath = (query ? `${query[0]}` : 'news')
									+ (query && query[1] !== '' ? `/${query[1]}` : '')
		return `https://hnpwa.com/api/v0/${subpath}.json`
	}

	static async getInitialProps ({query, pathname}) {
		const res = await fetch(HNPWA.routes(query))
		return {data: await res.json()}
	}

	componentDidMount () {
		// if ('serviceWorker' in navigator) {
		// 	navigator.serviceWorker.register('/static/workbox/sw.js', {scope: '../../'})
		// 		.then(reg => log('service worker registration succeed', reg.scope))
		// 		.catch(err => log('service worker registration failed', err.message))
		// }
	}

	render () {
		const body = ({data, url}) => {
			if (url.query['user']) {
				return user(data)
			} else {
				return feeds(data)
			}
		}

		return (
			<div>
				<Head>
					<title>NEXT-PWA</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					<link rel="manifest" href="/static/manifest/manifest.json" />
				</Head>
				{nav()}
				{body(this.props)}
				{styles()}
			</div>
		)
	}
}