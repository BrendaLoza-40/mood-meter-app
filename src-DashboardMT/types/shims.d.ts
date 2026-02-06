// Temporary type shims to unblock TS errors from third-party libs with incompatible typings.
// Recharts components are treated as any to avoid JSX type incompatibilities.
declare module "recharts" {
  export const BarChart: any;
  export const Bar: any;
  export const XAxis: any;
  export const YAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
  export const ResponsiveContainer: any;
  export const Legend: any;
  export const AreaChart: any;
  export const Area: any;
  export const LineChart: any;
  export const Line: any;
  export const PieChart: any;
  export const Pie: any;
  export const ScatterChart: any;
  export const Scatter: any;
  export const ZAxis: any;
  export const Cell: any;
}
