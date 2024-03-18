// import 'emoji-mart/css/emoji-mart.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const EmojiPickerComponent = ({
	onSelect,
}: {
	onSelect: (emoji: { native: string }) => void;
}) => {
	// const pickerProps = {
	// 	set: 'emojione',
	// 	onClick: onSelect,
	// 	title: 'Pick your emoji',
	// 	emoji: 'point_up',
	// };
	return <Picker data={data} onEmojiSelect={onSelect} />;
};

export default EmojiPickerComponent;
