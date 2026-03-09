const { getPanchang } = require("../utils/panchangHelper");
const { getCalculatedAnniversary } = require("../utils/anniversaryHelper");
const { getMasaFromMappedDate } = require("../utils/masaHelper");

const createOrUpdateClient = async (req, res) => {
    try {

        const {
            id,
            full_name,
            clientName,
            eventDate,
            event_type,
            custom_event_name,
            phone_number,
            occupation,
            address,
            city,
            state,
            pincode,
            notes
        } = req.body;

        if (!full_name || !phone_number) {
            return res.status(400).json({
                success: false,
                message: "Full name and phone number are required"
            });
        }

        let death_tithi = null;
        let death_paksha = null;
        let death_masa = null;

        // 🔹 Get Panchang details if Death Anniversary
        if (event_type === "Death Anniversary" && eventDate) {

            const dateStr = new Date(eventDate)
                .toISOString()
                .split("T")[0];

            const panchang = await getPanchang(dateStr);

            death_tithi = panchang.name;
            death_paksha = panchang.paksha;

            // Get masa from yearly_panchang
            death_masa = await getMasaFromMappedDate(
                req.db,
                eventDate
            );
        }

        let clientId = id;

        // 🔹 UPDATE CLIENT
        if (id) {

            await req.db.query(
                `UPDATE clients SET
                    full_name=?,
                    clientName=?,
                    eventDate=?,
                    event_type=?,
                    custom_event_name=?,
                    phone_number=?,
                    occupation=?,
                    address=?,
                    city=?,
                    state=?,
                    pincode=?,
                    notes=?,
                    death_tithi=?,
                    death_paksha=?,
                    death_masa=?
                WHERE id=?`,
                [
                    full_name,
                    clientName,
                    eventDate,
                    event_type,
                    custom_event_name,
                    phone_number,
                    occupation,
                    address,
                    city,
                    state,
                    pincode,
                    notes,
                    death_tithi,
                    death_paksha,
                    death_masa,
                    id
                ]
            );

        } else {

            // 🔹 CREATE CLIENT
            const [result] = await req.db.query(
                `INSERT INTO clients
                (
                    full_name,
                    clientName,
                    eventDate,
                    event_type,
                    custom_event_name,
                    phone_number,
                    occupation,
                    address,
                    city,
                    state,
                    pincode,
                    notes,
                    death_tithi,
                    death_paksha,
                    death_masa
                )
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    full_name,
                    clientName,
                    eventDate,
                    event_type,
                    custom_event_name,
                    phone_number,
                    occupation,
                    address,
                    city,
                    state,
                    pincode,
                    notes,
                    death_tithi,
                    death_paksha,
                    death_masa
                ]
            );

            clientId = result.insertId;
        }

        // 🔹 Get client data
        const [rows] = await req.db.query(
            "SELECT * FROM clients WHERE id=?",
            [clientId]
        );

        const client = rows[0];

        // 🔹 Calculate anniversary
        const anniversary = await getCalculatedAnniversary(
            req.db,
            client.death_tithi,
            client.death_paksha,
            client.death_masa
        );

        // 🔹 Remove unwanted fields
        const {
            calculated_anniversary_date,
            calculated_for_year,
            ...clientData
        } = client;

        res.status(id ? 200 : 201).json({
            success: true,
            message: id
                ? "Client updated successfully"
                : "Client created successfully",
            data: {
                ...clientData,
                anniversary
            }
        });

    } catch (error) {

        console.error("Create/Update Client Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

const getAllClients = async (req, res) => {
    try {

        const [rows] = await req.db.query(
            'SELECT * FROM clients ORDER BY created_at DESC'
        );

        const results = await Promise.all(
            rows.map(async (client) => {

                if (client.event_type !== "Death Anniversary") {
                    return {
                        ...client,
                        calculated_anniversary_date: null
                    };
                }

                const calculated_anniversary_date =
                    await getCalculatedAnniversary(
                        req.db,
                        client.death_tithi,
                        client.death_paksha,
                        client.death_masa
                    );

                return {
                    ...client,
                    calculated_anniversary_date
                };
            })
        );

        res.status(200).json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

const getClientById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await req.db.query(
            'SELECT * FROM clients WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });

    } catch (error) {
        console.error('Get client by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await req.db.query(
            'SELECT id FROM clients WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        await req.db.query(
            'DELETE FROM clients WHERE id = ?',
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Client deleted successfully'
        });

    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


module.exports = {
    createOrUpdateClient,
    getAllClients,
    getClientById,
    deleteClient
};