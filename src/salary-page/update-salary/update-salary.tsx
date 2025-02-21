import React from "react";
import {
  GetSalaryHistoryResponseDto,
  PayFrequency,
  UpdateSalaryRequestDto,
} from "../../services/salary/salary";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Props = {
  salary: GetSalaryHistoryResponseDto;
  handleUpdateSalary: (id: number, req: UpdateSalaryRequestDto) => void;
};

const formSchema = z.object({
  payFrequency: z.string().min(1, { message: "Pay frequency is required." }),
  effectiveDate: z.string().min(1, { message: "Effective date is required." }),
});

function UpdateSalary({ salary, handleUpdateSalary }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payFrequency: salary.payFrequency,
      effectiveDate: new Date(salary.effectiveDate).toISOString().split("T")[0],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const request: UpdateSalaryRequestDto = {
      payFrequency: values.payFrequency as any,
      effectiveDate: new Date(values.effectiveDate),
    };
    handleUpdateSalary(salary.id, request);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Salary</DialogTitle>
        <DialogDescription>Update the salary details.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="payFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={salary.payFrequency}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(PayFrequency).map((value: string) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="effectiveDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    defaultValue={
                      new Date(salary.effectiveDate).toISOString().split("T")[0]
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

export default UpdateSalary;
