import * as React from 'react';

export type EditableTextProps = {
	text?: string;
};

export default function EditableText({ text = 'Editable text' }: EditableTextProps) {
	return <span>{text}</span>;
}
