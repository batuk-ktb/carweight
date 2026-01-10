"use client";
import { OperatorStatus } from "@/app/page";

type Props = {
  value: OperatorStatus;
  onChange: (value: OperatorStatus) => void;
};

export default function OperatorStatusRadio({ value, onChange }: Props) {
  return (
    <div>
      <h3>Operator Mode</h3>

      <label style={{ marginRight: "16px" }}>
        <input
          type="radio"
          name="operatorStatus"
          checked={value === "on"}
          onChange={() => onChange("on")}
        />
        ON
      </label>

      <label>
        <input
          type="radio"
          checked={value === "off"}
          onChange={() => onChange("off")}
        />
        OFF
      </label>
    </div>
  );
}
