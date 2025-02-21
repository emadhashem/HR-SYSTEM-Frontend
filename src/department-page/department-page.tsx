import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Edit, PlusIcon, Trash } from "lucide-react";
import {
  createDepartmentApi,
  CreateDepartmentRequestDto,
  deleteDepartmentApi,
  GetAllDepartmentsWithEmployeesResponseDto,
  getDepartmentsWithEmployeesApi,
  updateDepartmentApi,
  UpdateDepartmentRequestDto,
} from "../services/department/department";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Dialog, DialogTrigger } from "../components/ui/dialog";
import CreateDepartment from "./create-department/create-department";
import { toast } from "sonner";
import UpdateDepartment from "./update-department/update-department";
function DepartmentPage() {
  const [departments, setDepartments] = useState<
    GetAllDepartmentsWithEmployeesResponseDto[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    _getDepartmentsWithEmployees();
  }, []);
  async function _getDepartmentsWithEmployees() {
    try {
      setIsLoading(true);
      const data = await getDepartmentsWithEmployeesApi();
      setDepartments(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateDepartment(
    request: CreateDepartmentRequestDto,
    cb: () => void
  ) {
    try {
      const res = await createDepartmentApi(request);
      setDepartments((arr) => [...arr, res]);
      cb();
    } catch (error: any) {
      toast.error("Error while creating department" + error.message);
    }
  }

  const onClick = (eve: React.MouseEvent<HTMLButtonElement>) => {
    eve.stopPropagation();
  };
  const handelDeleteDepartment = async (id: number) => {
    try {
      await deleteDepartmentApi(id);
      const newDepartments = departments.filter((item) => item.id !== id);
      setDepartments(newDepartments);
      toast.success("Department deleted successfully");
    } catch (error) {
      toast.error("Error while deleting department" + error);
    }
  };

  const handleUpdateDepartment = async (
    id: number,
    data: UpdateDepartmentRequestDto
  ) => {
    try {
      const res = await updateDepartmentApi(id, data);
      setDepartments((arr) => {
        return arr.map((item) => {
          if (item.id === id) {
            return res as GetAllDepartmentsWithEmployeesResponseDto;
          }
          return item;
        });
      });
      toast.success("Department updated successfully");
    } catch (error) {
      toast.error("Error while updating department" + error);
    }
  };

  return (
    <div className="flex justify-center flex-col h-full">
      <div className="flex  items-center justify-center mx-auto h-[100px]">
        <Dialog>
          <DialogTrigger>
            <Button className="bg-gray-800 hover:bg-gray-500">
              {" "}
              <PlusIcon className="mr-2 h-4 w-4" /> Add Department
            </Button>
          </DialogTrigger>
          <CreateDepartment handleCreateDepartment={handleCreateDepartment} />
        </Dialog>
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <div className=" container mx-auto py-5 flex flex-col gap-3 items-center justify-center flex-co">
          {departments.map((item) => (
            <div className="w-[70%]" key={item.name}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="bg-slate-800 hover:bg-slate-500 px-4 py-2 rounded-md font-semibold text-white">
                    <div className="w-full flex items-center justify-between px-2">
                      <p>{item.name}</p>
                      <div>
                        <Button
                          onClick={(ev) => {
                            onClick(ev);
                            handelDeleteDepartment(item.id);
                          }}
                          variant={"ghost"}
                        >
                          <Trash color="red" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-l font-extrabold my-3">Employees</p>
                    <Separator />
                    <div className="flex py-2 space-x-2 flex-wrap">
                      {item.employees.map((emp) => (
                        <Badge
                          key={emp.name}
                          className="flex flex-col max-w-fit rounded-2xl"
                        >
                          <p className="border-b-2">{emp.name}</p>
                          <p className="border-b-2">{emp.email}</p>
                          <p className="border-b-2">{emp.groupType}</p>
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    {" "}
                    <Edit />
                  </Button>
                </DialogTrigger>
                <UpdateDepartment
                  department={item}
                  handleUpdateDepartment={handleUpdateDepartment}
                />
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DepartmentPage;
