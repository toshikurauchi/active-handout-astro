export default interface Props {
  title?: string;
  collapsible?: boolean;
  collapsed?: boolean;
  type?:
    | "default"
    | "note"
    | "abstract"
    | "info"
    | "tip"
    | "success"
    | "question"
    | "warning"
    | "failure"
    | "danger"
    | "bug"
    | "example"
    | "quote"
    | "exercise";
}
