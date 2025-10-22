export default function Input(
  props: { placeholder?: string; value?: string; onChange?: any; type?: string } & any
) {
  return <input className="border rounded-lg p-2 bg-white" {...props} />;
}
