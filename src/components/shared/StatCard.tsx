import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease";
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "red" | "purple" | "amber" | "emerald" | "gray";
  small?: boolean;
}

export default function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = "blue",
  small = false,
}: StatCardProps) {
  // Safe color palette
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500 text-blue-600 bg-blue-50",
    green: "bg-emerald-500 text-emerald-600 bg-emerald-50",
    yellow: "bg-amber-500 text-amber-600 bg-amber-50",
    red: "bg-red-500 text-red-600 bg-red-50",
    purple: "bg-purple-500 text-purple-600 bg-purple-50",
    amber: "bg-amber-500 text-amber-600 bg-amber-50",
    emerald: "bg-emerald-500 text-emerald-600 bg-emerald-50",
    gray: "bg-gray-500 text-gray-600 bg-gray-50",
  };

  // Fallback if color not found
  const selected = colorClasses[color] || colorClasses["gray"];
  const [bgColor, textColor, lightBg] = selected.split(" ");

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${
        small ? "p-4" : "p-6"
      } hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p
            className={`${
              small ? "text-xs" : "text-sm"
            } font-medium text-gray-600 mb-1`}
          >
            {title}
          </p>
          <p
            className={`${
              small ? "text-xl" : "text-2xl"
            } font-bold text-gray-900`}
          >
            {value}
          </p>

          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  changeType === "increase"
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {changeType === "increase" ? "+" : "-"}
                {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">
                vs last period
              </span>
            </div>
          )}
        </div>

        <div className={`${small ? "p-2" : "p-3"} rounded-lg ${lightBg}`}>
          <Icon className={`${small ? "h-5 w-5" : "h-6 w-6"} ${textColor}`} />
        </div>
      </div>
    </div>
  );
}
