import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { CreateDepartmentRequestDto } from "../../services/department/department";

type Props = {
  handleCreateDepartment: (
    request: CreateDepartmentRequestDto,
    cb: () => void
  ) => void;
};

function CreateDepartment({ handleCreateDepartment }: Props) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isLoading },
  } = useForm<CreateDepartmentRequestDto>();
  const onSubmit = (data: any) => {
    const request: CreateDepartmentRequestDto = {
      name: data.name,
    };
    handleCreateDepartment(request, onSuccess);
  };
  const onSuccess = () => {
    reset();
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Department</DialogTitle>
      </DialogHeader>
      <form
        className="flex flex-col gap-4 py-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col justify-center">
          <div className="flex w-fit items-center gap-3">
            <Label htmlFor="name" className="text-center">
              Name
            </Label>
            <Input
              {...register("name", {
                required: {
                  value: true,
                  message: "Name is required",
                },
              })}
              id="name"
              placeholder="Finance"
              className="min-w-full"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm text-left pl-12">
              {errors.name.message}
            </p>
          )}
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </DialogContent>
  );
}

export default CreateDepartment;
