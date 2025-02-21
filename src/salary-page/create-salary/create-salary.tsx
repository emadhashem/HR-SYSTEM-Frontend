import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { findEmployeesApi } from "../../services/employee/employee";
import { toast } from "sonner";
import {
  CreateSalaryRequestDto,
  PayFrequency,
} from "../../services/salary/salary";

type Employee = {
  id: number;
  name: string;
};

type Props = {
  handleCreateSalary: (request: CreateSalaryRequestDto) => void;
};

const formSchema = z.object({
  employeeId: z.string().min(1, { message: "Employee is required." }),
  amount: z.string().min(1, { message: "Amount is required." }),
  payFrequency: z.string().min(1, { message: "Pay frequency is required." }),
  effectiveDate: z.string().min(1, { message: "Effective date is required." }),
});

function CreateSalary({ handleCreateSalary }: Props) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const result = await findEmployeesApi({
        perPage: 1000,
      }).then((data) =>
        data.data.map((item) => ({ name: item.name, id: item.id }))
      );
      setEmployees(result);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees");
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      amount: "",
      payFrequency: "",
      effectiveDate: new Date().toISOString().split("T")[0],
    },
  });
  const handleEmployeeSelect = (employeeId: string) => {
    form.setValue("employeeId", employeeId);
  };

  const [employeeSearch, setEmployeeSearch] = useState("");

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name}`.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const request: CreateSalaryRequestDto = {
      amount: Number(values.amount),
      payFrequency: values.payFrequency as any,
      employeeId: Number(values.employeeId),
      effectiveDate: new Date(values.effectiveDate),
    };
    handleCreateSalary(request);
    form.reset();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Salary</DialogTitle>
        <DialogDescription>
          Enter the salary details for a new record.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={false}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? employees.find(
                              (employee) =>
                                employee.id.toString() === field.value
                            )?.name
                          : "Select Employee..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-2">
                      <Input
                        placeholder="Search employee..."
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        className="mb-2"
                      />
                      <ScrollArea className="h-[150px]">
                        {filteredEmployees.length > 0 ? (
                          filteredEmployees.map((employee) => (
                            <Button
                              key={employee.id}
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => {
                                handleEmployeeSelect(employee.id.toString());
                                setEmployeeSearch("");
                              }}
                            >
                              {employee.name}
                            </Button>
                          ))
                        ) : (
                          <p className="text-sm text-center">
                            No employees found.
                          </p>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Amount" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pay Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
                  <Input type="date" {...field} />
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

export default CreateSalary;
