"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AVAILABILITY, PROPERTY_CATEGORIES, PROPERTY_TYPES, STATUS } from "@/components/add_property_form/defaultData";
import TableDisplay from "@/components/property/TableDisplay";
import { CustomCalendar } from "@/components/CustomCalader";
import { ArrowLeftIcon, ArrowRightIcon, X } from "lucide-react";
import { usePropertyStore } from "@/store/usePropertyStore";
import PageLoading from "@/components/loaders/PageLoader";
import { updatePropertyDb } from "@/lib/firebase/property_service";
import { showWarning } from "@/components/ui/toasts";
import OverlayLoader from "@/components/loaders/OverlayLoader";
import ItemNotFound from "@/components/ItemNotFound";

export default function ListPropertiesPage() {

  const { properties, loading: loadingProperties, updateProperty } = usePropertyStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [loadind, setLoading] = useState(false);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Filtering logic
  const filteredProperties = useMemo(() => {
    return properties.filter(p => p.availability !== "Trash").filter((p) => {
      const matchesSearch = (p.id || "").toLowerCase().includes(searchTerm.toLowerCase()) || p.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;

      const matchesType = typeFilter === "all" || p.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;

      const matchesState = stateFilter === "all" || p.state === stateFilter;

      const matchesAvail =
        availabilityFilter === "all" || p.availability === availabilityFilter;

      const date = new Date((p.updatedAt || ""));
      const afterStart = !startDate || date >= new Date(startDate);
      const beforeEnd = !endDate || date <= new Date(endDate);

      return (
        matchesSearch &&
        matchesCat &&
        matchesType &&
        matchesStatus &&
        matchesState &&
        matchesAvail &&
        afterStart &&
        beforeEnd
      );
    });

  }, [
    searchTerm,
    categoryFilter,
    typeFilter,
    statusFilter,
    stateFilter,
    availabilityFilter,
    startDate,
    endDate,
    properties,
  ]);

  if (loadingProperties) return <PageLoading loading={loadingProperties} />

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / perPage);
  const paginated = filteredProperties.slice((page - 1) * perPage, page * perPage);

  const allChecked = selected.length === paginated.length && paginated.length > 0;

  const toggleSelectAll = () => {
    if (allChecked) setSelected([]);
    else setSelected(paginated.map((p) => p.id || ""));
  };

  const toggleSelect = (id: string) => {
    setSelected((pre) =>
      pre.includes(id) ? pre.filter(s => s !== id) : [...pre, id]
    );
  };

  const handleTrash = async (id?: string) => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await updatePropertyDb(id, { availability: "Trash" });
      if (res) {
        updateProperty(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const trashAll = async () => {
    await Promise.all(selected.map(s => handleTrash(s)));
    showWarning("Property moved to Trash!");

  };
  

  return (
    <div className="w-full">
      {/* Filter and Search Bar */}
      <div className="mb-4 w-full">

        {selected.length > 0 ? (
          <div className="flex justify-between items-center shadow w-full p-3">
            <Button
              variant="ghost"
              onClick={() => setSelected([])}
            >
              <X size={20} />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={trashAll}
            >
              Trash
            </Button>
          </div>
        ) :
          <div className="flex gap-6 flex-wrap flex-row md:items-end md:justify-between">
            {/* Selection Filters */}
            <div className="flex flex-wrap gap-2">
              {/* by Reference ID */}
              <Input
                placeholder="Reference ID or Title..."
                className="w-60 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* by category */}
              <Select
                onValueChange={(e) => setCategoryFilter(e)}
              >
                <SelectTrigger
                  className="cursor-pointer" >
                  <SelectValue
                    placeholder="Category"
                    className="text-sm"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="cursor-pointer text-sm"
                    value={"all"}
                  >
                    All
                  </SelectItem>
                  {PROPERTY_CATEGORIES.map((c) => (
                    <SelectItem
                      className="cursor-pointer text-sm"
                      key={c}
                      value={c}
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* by type */}
              <Select
                onValueChange={(e) => setTypeFilter(e)}
              >
                <SelectTrigger
                  className="cursor-pointer" >
                  <SelectValue
                    placeholder="Types"
                    className="text-sm"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="cursor-pointer text-sm"
                    value={"all"}
                  >
                    All
                  </SelectItem>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem
                      className="cursor-pointer text-sm"
                      key={type}
                      value={type}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* by status */}
              <Select
                onValueChange={(e) => setStatusFilter(e)}
              >
                <SelectTrigger
                  className="cursor-pointer" >
                  <SelectValue
                    placeholder="Status"
                    className="text-sm"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="cursor-pointer text-sm"
                    value={"all"}
                  >
                    All
                  </SelectItem>
                  {STATUS.map((status) => (
                    <SelectItem
                      className="cursor-pointer text-sm"
                      key={status}
                      value={status}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* by avialibity */}
              <Select
                onValueChange={(e) => setAvailabilityFilter(e)}
              >
                <SelectTrigger
                  className="cursor-pointer" >
                  <SelectValue
                    placeholder="Availability"
                    className="text-sm"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="cursor-pointer text-sm"
                    value={"all"}
                  >
                    All
                  </SelectItem>
                  {AVAILABILITY.map((status) => (
                    <SelectItem
                      className="cursor-pointer text-sm"
                      key={status.value}
                      value={status.value}
                    >
                      {status.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* by state */}
              <Select
                onValueChange={(e) => setStateFilter(e)}
              >
                <SelectTrigger
                  className="cursor-pointer" >
                  <SelectValue
                    placeholder="State"
                    className="text-sm"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="cursor-pointer text-sm"
                    value={"all"}
                  >
                    All
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer text-sm"
                    value={"Lagos"}
                  >
                    Lagos
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer text-sm"
                    value={"Ogun"}
                  >
                    Ogun
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filters */}
            <div className="flex gap-6">
              <div className="flex flex-col">
                <label className="text-sm block mb-2">From</label>
                <CustomCalendar
                  date={startDate}
                  setDate={(date) => setStartDate(date)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm block mb-2">To</label>
                <CustomCalendar
                  date={endDate}
                  setDate={(date) => setEndDate(date)}
                />
              </div>
            </div>

          </div>
        }
      </div>


      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th>
                <Checkbox checked={allChecked} onCheckedChange={toggleSelectAll} />
              </th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Property Details</th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Availability</th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Location</th>
              <th className="px-4 py-3 text-left text-nowrap whitespace-pre">Last Updated</th>
              <th className="px-4 py-3 text-right text-nowrap whitespace-pre">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((p) => (
                <TableDisplay
                  key={p.id}
                  p={p}
                  selected={selected}
                  setSelected={toggleSelect}
                  placeViewing="Normal"
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                >
                  <ItemNotFound>No properties found.</ItemNotFound>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-end gap-3 items-center">
          <Button
            type="button"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ArrowLeftIcon className="h-5 w-5" /> Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next <ArrowRightIcon className="h-5 w-5" />
          </Button>
        </div>
      )}
      <OverlayLoader loading={loadind} />
    </div>
  );
};
