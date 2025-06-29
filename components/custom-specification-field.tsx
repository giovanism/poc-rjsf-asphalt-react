import { FieldProps } from "@rjsf/utils";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface Specification {
  type: string;
  requests: {
    cpu: string;
    memory: string;
  };
  limits: {
    cpu: string;
    memory: string;
  };
}

interface Presets {
  [key: string]: Specification;
}

export function CustomSpecificationField(props: FieldProps) {
  const [types, setPresets] = useState<Presets>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCustom, setIsCustom] = useState(false);
  const value = props.formData || {
    type: "",
    requests: { cpu: "", memory: "" },
    limits: { cpu: "", memory: "" },
  };

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await fetch("/api/presets/specifications");
        if (!response.ok) {
          throw new Error("Failed to fetch presets");
        }
        const data = await response.json();
        setPresets(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load presets");
      } finally {
        setLoading(false);
      }
    };

    fetchPresets();
  }, []);

  useEffect(() => {
    // Check if current value matches any preset
    const matchingPreset = Object.values(types).some(
      (preset) => preset.type === value.type
    );
    setIsCustom(!matchingPreset && value.type !== "");
  }, [value.type, types]);

  const handleTypeChange = (typeKey: string) => {
    if (typeKey === "custom") {
      setIsCustom(true);
      // Keep existing values when switching to custom mode, just change the type
      props.onChange({
        ...value,
        type: "custom",
      });
      return;
    }

    const type = types[typeKey];
    if (type) {
      setIsCustom(false);
      props.onChange(type);
    }
  };

  const handleCustomChange =
    (field: "type" | "requests" | "limits", subField?: "cpu" | "memory") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = { ...value };
      if (subField) {
        newValue[field] = { ...newValue[field], [subField]: e.target.value };
      } else {
        newValue[field] = e.target.value;
      }
      props.onChange(newValue);
    };

  const currentPresetKey = isCustom
    ? "custom"
    : Object.entries(types).find(
        ([_, preset]) => preset.type === value.type
      )?.[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Specification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="Type">Type</Label>
              <Select
                disabled={loading}
                value={currentPresetKey || ""}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a preset..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(types).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.type}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {isCustom ? (
              <div className="grid gap-4">
                <div>
                  <h4 className="font-medium text-base mb-2">
                    Requests
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm">CPU</Label>
                      <Input
                        type="text"
                        value={value.requests?.cpu || ""}
                        onChange={handleCustomChange("requests", "cpu")}
                        placeholder="e.g., 0.5"
                      />
                    </div>
                    <div>
                      <Label>Memory</Label>
                      <Input
                        type="text"
                        value={value.requests?.memory || ""}
                        onChange={handleCustomChange("requests", "memory")}
                        placeholder="e.g., 512Mi"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-base mb-2">
                    Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm">CPU</Label>
                      <Input
                        type="text"
                        value={value.limits?.cpu || ""}
                        onChange={handleCustomChange("limits", "cpu")}
                        placeholder="e.g., 1"
                      />
                    </div>
                    <div>
                      <Label>Memory</Label>
                      <Input
                        type="text"
                        value={value.limits?.memory || ""}
                        onChange={handleCustomChange("limits", "memory")}
                        placeholder="e.g., 1Gi"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              value.requests &&
              value.limits && (
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium text-base mb-2">
                      Requests
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">CPU</Label>
                        <div className="text-sm">{value.requests.cpu}</div>
                      </div>
                      <div>
                        <Label className="text-sm">Memory</Label>
                        <div className="text-sm">{value.requests.memory}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {" "}
                    <h4 className="font-medium text-base mb-2">
                      Limits
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-sm">CPU</Label>
                        <div className="text-sm">{value.limits.cpu}</div>
                      </div>
                      <div>
                        <Label className="text-sm">Memory</Label>
                        <div className="text-sm">{value.limits.memory}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
