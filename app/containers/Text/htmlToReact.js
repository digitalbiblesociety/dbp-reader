import React from 'react';
const HtmlToReact = require('html-to-react');
const HtmlToReactParser = require('html-to-react').Parser;
// TODO: Create a class that has addClickToNotes as a method if there are issues with this way
let previousHtml = '';
let previousResult = '';

export const addClickToNotes = ({ html, action }) => {
	// Keeps this function from running over and over if the html is unchanged
	if (html === previousHtml) {
		return previousResult;
	}
	previousHtml = html;

	const isValidNode = () => true;
	const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
	const processingInstructions = [
		{
			// Custom <h1> processing
			replaceChildren: true,
			shouldProcessNode(node) {
				if (node.attribs && node.attribs.class === 'note' && node.attribs.id === 'note-0') {
					return node.attribs.class === 'note';
				}
				return false;
				// console.log('in second should process', node)
				// return node.parent && node.parent.name && node.parent.name === 'h1';
			},
			processNode(node, children) {
				const footnoteId = children[0].props.href.slice(1);
				const newNode = { ...node, attribs: { ...node.attribs, onClick: () => action({ footnoteId, coords: { x: 5, y: 15 } }) } };
				// console.log('old node', node);
				console.log('new node', newNode);
				return React.createElement(newNode);
				// node.attribs.onClick = () => action({ footnoteId, coords: { x: 5, y: 15 } });
				// return node;
			},
		}, {
			shouldProcessNode() {
				// need to figure out what this is for
				return true;
			},
			processNode: processNodeDefinitions.processDefaultNode,
		}];
	const htmlToReactParser = new HtmlToReactParser();
	const reactComponents = htmlToReactParser.parseWithInstructions(html, isValidNode,
		processingInstructions);
	previousResult = reactComponents[0];
	// console.log('React component', reactComponents[0]);
	return reactComponents[0];
};
