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

const feeds = src => (
	<ul>{
		src.map(f =>
		<li key={f.id}>
			<span className="points">{f.points}</span>
			<span>
				<div><a href={f.url} target="_black">{f.title}</a></div>
				<div>
					<span>by <Link href={`/users?id=${f.user}`}><a>{f.user}</a></Link></span>
					<span> | <Link href={`/comments?id=${f.id}`}><a>{f.comments_count || 0}</a></Link></span>
				</div>
			</span>
		</li>)
	}</ul>
)

const nav = () => (
	<nav>
		<Link href='/'><a>News</a></Link>
		<Link href='/?feed=newest'><a>Newest</a></Link>
		<Link href='/?feed=ask'><a>Ask</a></Link>
		<Link href='/?feed=show'><a>Show</a></Link>
		<Link href='/?feed=jobs'><a>Jobs</a></Link>
	</nav>
)

export default class extends React.PureComponent {
	static async getInitialProps ({query, pathname}) {
		const res = await fetch(`https://hnpwa.com/api/v0/${query.feed || 'news' }.json`)
		return {feeds: await res.json()}
	}

	componentDidMount () {
		// if ('serviceWorker' in navigator) {
		// 	navigator.serviceWorker.register('/static/workbox/sw.js', {scope: '../../'})
		// 		.then(reg => log('service worker registration succeed', reg.scope))
		// 		.catch(err => log('service worker registration failed', err.message))
		// }
	}

	render () {
		return (
			<div>
				<Head>
					<title>NEXT-PWA</title>
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					<link rel="manifest" href="/static/manifest/manifest.json" />
				</Head>
				<header>
					{nav()}
				</header>
				<div>
					{feeds(this.props.feeds)}
				</div>
				{styles()}
			</div>
		)
	}
}