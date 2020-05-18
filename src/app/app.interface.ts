export interface FileReaderEventTarget extends EventTarget {
    result: string;
    files?: any;
}

export interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}

export interface UserFields {
    firstName: string;
    lastName: string;
    location: string;
    grade: string;
    skills: string;
}