import javax.swing.*;
import java.awt.*;

public class TabLayoutExample {
    public static void main(String[] args) {
        // Create the main frame
        JFrame frame = new JFrame("Flight App");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(400, 300);

        // Create tabbed pane
        JTabbedPane tabbedPane = new JTabbedPane();

        // Flights tab
        JPanel flightsPanel = new JPanel();
        flightsPanel.add(new JLabel("Flights Screen"));
        tabbedPane.addTab("Flights", flightsPanel);

        // My Bookings tab
        JPanel bookingsPanel = new JPanel();
        bookingsPanel.add(new JLabel("My Bookings Screen"));
        tabbedPane.addTab("My Bookings", bookingsPanel);

        // Profile tab
        JPanel profilePanel = new JPanel();
        profilePanel.add(new JLabel("Profile Screen"));
        tabbedPane.addTab("Profile", profilePanel);

        // Add tabbed pane to frame
        frame.add(tabbedPane, BorderLayout.CENTER);

        // Show frame
        frame.setVisible(true);
    }
}
