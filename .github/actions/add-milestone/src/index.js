/**
 * External dependencies
 */
const { setFailed, getInput } = require( '@actions/core' );
const { context, GitHub } = require( '@actions/github' );

/**
 * Given a commit object, returns a promise resolving with the pull request
 * number associated with the commit, or null if an associated pull request
 * cannot be determined.
 *
 * @param {WebhookPayloadPushCommit} commit Commit object.
 *
 * @return {number?} Pull request number, or null if it cannot be
 *                            determined.
 */
function getAssociatedPullRequest( commit ) {
	const match = commit.message.match( /\(#(\d+)\)$/m );
	return match && Number( match[ 1 ] );
}

/**
 * Get the next valid milestone.
 * It must be an open milestone, with a due date in the future,
 * and not past code freeze yet.
 *
 * @param { GitHub } octokit Initialized Octokit REST client.
 * @param { string } owner   Repository owner.
 * @param { string } repo    Repository name.
 *
 * @return {Promise<OktokitIssuesListMilestonesForRepoResponseItem|void>} Promise resolving to milestone, if exists.
 */
async function getNextValidMilestone( octokit, owner, repo ) {
	const allMilestones = octokit.issues.listMilestones( {
		owner,
		repo,
		state: 'open',
		sort: 'due_on',
		direction: 'desc',
	} );
	return allMilestones;
}

async function run() {
	const token = getInput( 'token' );
	if ( ! token ) {
		setFailed( 'main: Input `token` is required' );
		return;
	}

	const octokit = new GitHub( token );

	// Get info about the event.
	const eventPayload = context.payload;

	// We should not get to that point as the action is triggered on pushes to master, but...
	if ( eventPayload.ref !== 'refs/heads/master' ) {
		//setFailed( 'Commit is not to `master`. Aborting' );
		//return;
	}

	const prNumber = getAssociatedPullRequest( eventPayload.commits[ 0 ] );
	if ( ! prNumber ) {
		setFailed( 'Commit is not a squashed PR. Aborting' );
		return;
	}

	// No need to do anything if the PR already has a milestone.
	const owner = eventPayload.repository.owner.login;
	const repo = eventPayload.repository.name;
	const {
		data: { milestone: pullMilestone },
	} = await octokit.issues.get( { owner, repo, issue_number: prNumber } );

	if ( pullMilestone ) {
		setFailed( 'Pull request already has a milestone. Aborting' );
		return;
	}

	// Get next valid milestone.
	const test = await getNextValidMilestone( octokit, owner, repo );

	console.log( JSON.stringify( test ) );
}

run();
