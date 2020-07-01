async function run() {
	console.log( `it's running!` );
	/*
	 * See https://github.com/octokit/action.js/ for more info
	 */
	const octokit = new Octokit();

	// Get info about the event.
	const eventPayload = require( process.env.GITHUB_EVENT_PATH );
	console.log( `Our event payload is ${ eventPayload }` );
	// Look for words indicating that a PR fixes an issue.
	const regex = /(?:close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved):? +(?:\#?|https?:\/\/github\.com\/jeherve\/jetpack\/issues\/)(\d+)/gi;

	let match;
	while ( ( match = regex.exec( eventPayload.pull_request.body ) ) ) {
		const [ , issue ] = match;
		console.log( `We have a match. The issue ID is ${ issue }` );

		// Assign the issue to the PR author.
		const addAssignee = await octokit.issues.addAssignees( {
			owner: eventPayload.repository.owner.login,
			repo: eventPayload.repository.name,
			issue_number: +issue,
			assignees: [ eventPayload.pull_request.user.login ],
		} );
		console.log( `PR author assigned: ${ addAssignee }` );

		// Add the In Progress label to the issue.
		const addLabel = await octokit.issues.addLabels( {
			owner: eventPayload.repository.owner.login,
			repo: eventPayload.repository.name,
			issue_number: +issue,
			labels: [ '[Status] In Progress' ],
		} );
		console.log( `Label added: ${ addLabel }` );
	}
}
