const { getInput, setFailed } = require( '@actions/core' );
const OpenAI = require( 'openai' );
const debug = require( '../debug' );

/**
 * Send a message to OpenAI.
 *
 * @param {string} message - Message to send to OpenAI.
 *
 * @return {Promise<string>} Promise resolving to the response from OpenAI.
 */
async function sendOpenAiRequest( message ) {
	const apiKey = getInput( 'openai_api_key' );
	if ( ! apiKey ) {
		setFailed( 'openai: Input openai_api_key is required but missing. Aborting.' );
		return;
	}

	const client = new OpenAI( { apiKey } );

	try {
		const chatCompletion = await client.chat.completions.create( {
			messages: [
				{ role: 'system', content: 'You are a helpful assistant.' },
				{ role: 'user', content: message },
			],
			model: 'gpt-4',
		} );

		return chatCompletion.data.choices[ 0 ].message.content;
	} catch ( error ) {
		if ( error instanceof OpenAI.APIError ) {
			debug( `openai: Error sending message to OpenAI: ${ error.name }` );
		}
		return '';
	}
}

module.exports = sendOpenAiRequest;
