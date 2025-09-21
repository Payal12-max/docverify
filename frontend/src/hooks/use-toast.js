import { toast } from "sonner"

export const useToast = () => {
  return {
    toast: (props) => {
      const { title, description, variant, ...rest } = props;
      
      if (variant === "destructive") {
        return toast.error(title, {
          description,
          ...rest
        });
      }
      
      return toast.success(title, {
        description,
        ...rest
      });
    }
  };
};