export const InputState = <T extends {}>(props: { state: T; name: string; form: string }) => (
  <input defaultValue={JSON.stringify(props.state)} className="hidden" name={props.name} form={props.form} />
);
