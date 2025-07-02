import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SimpleLineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
}

export const SimpleLineChart = ({ data, xKey, yKey, color = "#3b82f6" }: SimpleLineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface SimpleBarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
}

export const SimpleBarChart = ({ data, xKey, yKey, color = "#3b82f6" }: SimpleBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
};

interface SimplePieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

export const SimplePieChart = ({ data, dataKey, nameKey, colors = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b"] }: SimplePieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};