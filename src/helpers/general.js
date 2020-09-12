const GeneralHelper = {
	// text -> string
	// start -> number of characters after 0x to include
	// end -> nubmer of characters from the end to include
	ellipseId: (text, start = 4, end = 4) => {
		const startLength = '0x'.length + start;
		const endLength = end;
		return `${text.substring(0, startLength)}...${text.substring(text.length - endLength)}`;
	}
};

export default GeneralHelper;;
