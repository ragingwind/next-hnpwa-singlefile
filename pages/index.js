import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import 'isomorphic-unfetch';

const log = (...args) =>
	console.log(
		'%csw',
		'background-color:black; color:white; padding: 2px 0.5em; border-radius: 0.5em;',
		...args
	);

const Styles = () => (
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
		}
		header {
			display: flex;
			padding: 0;
			margin: 0 0 30px 0;
		}
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
		.container {
			padding: 10px;
		}
		.container div {
			margin: 10px 0 5px 0;
		}
		.commment {
			border-top: 1px solid grey;
		}
		@media (max-width: 600px) {
			header {
				justify-content: none;
			}
		}
		body {
			font-family: Helvetica, sans-serif;
		}
	`}</style>
);

const Feed = ({ id, points, url, title, user, comments_count }) => (
	<li key={id}>
		<span className="points">{points}</span>
		<span>
			<div>
				<a href={url} target="_black">
					{title}
				</a>
			</div>
			<div>
				<span>
					<Link href={`/?user=${user}`}>
						<a>{user}</a>
					</Link>
				</span>
				<span>
					{' '}
					|{' '}
					<Link href={`/?item=${id}`}>
						<a>{comments_count || 0} comments</a>
					</Link>
				</span>
			</div>
		</span>
	</li>
);

const More = query => {
	const max = {
		news: 10,
		newest: 10,
		ask: 2,
		show: 2,
		jobs: 1
	};

	query = Object.entries(query);
	query = query.length > 0 ? query[0][0].split('/') : ['news', 1];

	const feed = query[0];
	const page = Number.parseInt(query[1]);

	return (
		<div>
			{page < max[feed] ? (
				<Link href={`/?${feed}/${page + 1}`}>
					<a>More...</a>
				</Link>
			) : (
				''
			)}
		</div>
	);
};

const Feeds = (src, url) => (
	<div>
		<div>
			<ul>{src.map(f => Feed(f))}</ul>
		</div>
		<div>{More(url)}</div>
	</div>
);

const User = user => (
	<div className="container">
		<h1>{user.id}</h1>
		<div>Created: {user.created}</div>
		<div>Karma: {user.karma}</div>
		<div>Delay: {user.delay}</div>
		<div>About: {user.about}</div>
	</div>
);

const Comment = ({ id, content, user, time_ago }) => (
	<div key={id} className="commment">
		<div dangerouslySetInnerHTML={{ __html: content }} />
		<div>
			<Link href={`/?user=${user}`}>
				<a>{user}</a>
			</Link>{' '}
			| {time_ago}
		</div>
	</div>
);

const Comments = item => (
	<div className="container">
		<div>
			<h2>
				<a href={item.url} target="_black">
					{item.title}
				</a>
			</h2>
			<div>
				<Link href={`/?user=${item.user}`}>
					<a>{item.user}</a>
				</Link>{' '}
				| {item.points} points
			</div>
		</div>
		<div>{item.comments.map(c => Comment(c))}</div>
	</div>
);

const Navigation = () => (
	<header>
		<nav>
			<Link href="/">
				<a>News</a>
			</Link>
			<Link href="/?newest/1">
				<a>Newest</a>
			</Link>
			<Link href="/?ask/1">
				<a>Ask</a>
			</Link>
			<Link href="/?show/1">
				<a>Show</a>
			</Link>
			<Link href="/?jobs/1">
				<a>Jobs</a>
			</Link>
		</nav>
	</header>
);

class HNPWApp extends React.PureComponent {
	static routes(query) {
		query = Object.entries(query)[0];
		const subpath =
			(query ? `${query[0]}` : 'news/1') +
			(query && query[1] !== '' ? `/${query[1]}` : '');
		return `https://api.hnpwa.com/v0/${subpath}.json`;
	}

	static async getInitialProps({ query, pathname }) {
		const res = await fetch(HNPWApp.routes(query));
		return { data: await res.json() };
	}

	async componentDidMount() {
		if ('serviceWorker' in navigator) {
			await navigator.serviceWorker.register('/static/sw.js', { scope: '../../' })
		}
	}

	renderContent({ data, router }) {
		if (router.query['user']) {
			return User(data);
		} else if (router.query['item']) {
			return Comments(data);
		} else {
			return Feeds(data, router.query);
		}
	}

	render() {
		return (
			<div>
				<Head>
					<title>NextHNPWA</title>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<link rel="icon" href="/static/favicon.ico" type="image/x-icon" />
					<link rel="manifest" href="/static/manifest/manifest.json" />
				</Head>
				{Navigation()}
				{this.renderContent(this.props)}
				{Styles()}
			</div>
		);
	}
}

export default withRouter(HNPWApp);
