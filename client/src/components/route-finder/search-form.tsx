import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchRoute, searchRouteSchema, type Route } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MapPin } from "lucide-react";

interface SearchFormProps {
  onRouteFound: (route: Route) => void;
}

export default function SearchForm({ onRouteFound }: SearchFormProps) {
  const { toast } = useToast();
  const form = useForm<SearchRoute>({
    resolver: zodResolver(searchRouteSchema),
    defaultValues: {
      source: "",
      destination: "",
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (data: SearchRoute) => {
      const res = await apiRequest("POST", "/api/routes/search", data);
      return res.json();
    },
    onSuccess: (data) => {
      onRouteFound(data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SearchRoute) => {
    searchMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Enter starting point" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Enter destination" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={searchMutation.isPending}
        >
          {searchMutation.isPending ? "Searching..." : "Find Routes"}
        </Button>
      </form>
    </Form>
  );
}
