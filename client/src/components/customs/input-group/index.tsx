import React from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface FormValues {
  items: { name: string; quantity: number }[];
}
const InputGroup = () => {
  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      items: [{ name: "", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items", // This must match the array field in your FormValues interface
  });
  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log({ data });
        })}
      >
        {fields.map((item, index) => (
          <div key={item.id}>
            {" "}
            {/* 'id' is automatically added by useFieldArray */}
            <input {...register(`items.${index}.name`)} />
            <input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
            />
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "", quantity: 0 })}>
          Add Item
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InputGroup;
