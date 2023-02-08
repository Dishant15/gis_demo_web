const YES_NO_OPTS = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];

const GOOD_BAD_OPTS = [
  { value: "G", label: "Good" },
  { value: "B", label: "Bad" },
];

export const CONFIG = [
  {
    section: "PoP Survey Format",
    fields: [
      [
        {
          label: "Package (A/B/C/D)",
          field: "package_display",
          type: "simple",
        },
        { label: "MSI/SI Name", field: "msi_name", type: "simple" },
      ],
      [
        { label: "District Name", field: "district_name", type: "simple" },
        { label: "District Code", field: "district_code", type: "simple" },
      ],
      [
        { label: "Block Name", field: "block_name", type: "simple" },
        { label: "Block Code", field: "block_code", type: "simple" },
      ],
      [
        { label: "POP Name", field: "pop_name", type: "simple" },
        { label: "POP Code", field: "pop_code", type: "simple" },
      ],
      [
        {
          label: "POP type (Block/Gp)",
          field: "pop_type_display",
          type: "simple",
        },
        {
          label: "Floor for installation",
          field: "installation_floor",
          type: "simple",
        },
      ],
      [
        { label: "Land mark", field: "land_mark", type: "simple" },
        {
          label: "Location Details",
          field: "location_details",
          type: "simple",
        },
      ],
      [
        {
          label: "Block / GP connected from",
          field: "connected_from",
          type: "simple",
        },
        {
          label: "Block / GP connected to",
          field: "connected_to",
          type: "simple",
        },
      ],
    ],
  },
  {
    section: "Civil & Electrical",
    isLeft: true,
    fields: [
      [
        {
          label: "Building Condition",
          field: "building_condition_display",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Rooftop/ceiling Condition",
          field: "ceil_condition_display",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Pop location reachability",
          field: "pop_location_reachability_display",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Availability of EB service connection",
          field: "eb_service_connection_availability_display",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Availability of regular power in day",
          field: "regular_power_availability",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Input Voltage",
          field: "input_voltage",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Service connection / Customer number",
          field: "service_connection",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Total contracted load",
          field: "total_contracted_load",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Load Required for PoP room",
          field: "load_for_pop_room",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Incoming EB cable size",
          field: "incoming_eb_cable_size",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Size of main entry door to pop room",
          field: "main_door_entry_size",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Number of windows",
          field: "number_of_windows",
          type: "simple",
        },
        { colSpan: 2 },
      ],

      [
        {
          label: "Space availibility",
          field: "space_availibility",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Seepage",
          field: "seepage_display",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Power backup (availibility of DG)",
          field: "power_backup_display",
          type: "simple",
        },

        { colSpan: 2 },
      ],
    ],
  },
  {
    section: "Other Details",
    isLeft: true,
    fields: [
      [
        {
          label: "Availibility of SWAN connectivity",
          field: "avail_swan_connectivity_display",
          type: "simple",
        },
        { colSpan: 2 },
      ],
      [
        {
          label: "Distance from nearest SWAN Pop",
          field: "dist_near_swan_pop",
          type: "simple",
        },
        { colSpan: 2 },
      ],
    ],
  },
  {
    section:
      "Contact Details of Panchayat Secretaty / Block Representative / GP Representative",
    isLeft: true,
    fields: [
      [
        {
          label: "Contact person name",
          field: "contact_person_name",
          type: "simple",
        },
        { label: "Designation", field: "designation", type: "simple" },
      ],
      [
        { label: "Mobile No", field: "mobile_no", type: "simple" },
        { label: "Email Id", field: "email_id", type: "simple" },
      ],
      [
        {
          label: "Superior / Alternate name",
          field: "alternate_name",
          type: "simple",
        },
        {
          label: "Designation",
          field: "alternate_designation",
          type: "simple",
        },
      ],
      [
        { label: "Mobile No", field: "alternate_mobile_no", type: "simple" },
        { label: "Email Id", field: "alternate_email_id", type: "simple" },
      ],
    ],
  },
];
